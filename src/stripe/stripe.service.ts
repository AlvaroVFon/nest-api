import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order, OrderStatus } from 'src/orders/entities/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly stripeApiKey: string =
    this.configService.get('STRIPE_API_KEY');

  constructor(
    private configService: ConfigService,
    private orderService: OrdersService,
  ) {
    this.stripe = new Stripe(this.stripeApiKey, {
      apiVersion: '2024-06-20',
    });
  }
  async createSession(orderId: number): Promise<string> {
    try {
      const order = await this.orderService.findOne(orderId);

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const session = await this.stripe.checkout.sessions.create({
        customer_email: order.user.email,
        payment_method_types: ['card'],
        line_items: order.items.map((item) => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.product.name,
            },
            unit_amount: item.product.price * 100,
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });

      this.orderService.update(order.id, {
        checkoutSessionId: session.id,
      });

      return session.url;
    } catch (error) {
      throw error;
    }
  }

  async findAllSessions() {
    try {
      return await this.stripe.checkout.sessions.list();
    } catch (error) {
      throw error;
    }
  }
  async getCheckoutSession(
    sessionId: string,
    options?: Stripe.Checkout.SessionRetrieveParams,
  ) {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId, options);
    } catch (error) {
      throw error;
    }
  }

  async fullFillCheckout(sessionId: string): Promise<Order> {
    try {
      const session = await this.getCheckoutSession(sessionId, {
        expand: ['line_items'],
      });

      if (!session) {
        throw new NotFoundException('Session not found');
      }

      const order = await this.orderService.findOneBySessionId(sessionId);

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (
        session.payment_status === 'paid' &&
        session.amount_total === order.total
      ) {
        await this.orderService.update(order.id, {
          status: OrderStatus.PAID,
          payedAt: new Date(),
        });
      }

      return order;
    } catch (error) {
      throw error;
    }
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
@Controller('/stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  //   @Post(':id')
  //   async createSession(@Param('id') id: string) {
  //     return {
  //       paymentLink: await this.stripeService.createSession(+id),
  //     };
  //   }

  @Get(':sessionId')
  async getCheckoutSession(@Param('sessionId') sessionId: string) {
    const session = await this.stripeService.getCheckoutSession(sessionId);
    return session;
  }

  @Post()
  async stripeWebhook(@Body() payload: any): Promise<Stripe.Checkout.Session> {
    const session = await this.stripeService.getCheckoutSession(
      payload.data.object.id,
    );

    if (session.payment_status === 'paid') {
      /**
       * Update your order status here
       * Generate invoice or whatever you want to do after payment
       */
      console.log('Payment was successful');
    }

    return session;
  }
}

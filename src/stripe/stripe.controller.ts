import { Controller, Get, Param, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('/stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post(':id')
  async createSession(@Param('id') id: string) {
    return {
      paymentLink: await this.stripeService.createSession(+id),
    };
  }

  @Get(':sessionId')
  async getCheckoutSession(@Param('sessionId') sessionId: string) {
    const session = await this.stripeService.getCheckoutSession(sessionId);
    return session;
  }

  @Post('/webhook')
  async stripeWebhook() {}
}

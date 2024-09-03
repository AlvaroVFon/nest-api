import { All, Controller } from '@nestjs/common';

@Controller('not-found-controller')
export class NotFoundControllerController {
  @All('*')
  notFound() {
    return { statusCode: 404, message: 'Not found' };
  }
}

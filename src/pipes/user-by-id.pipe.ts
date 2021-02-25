import { UserService } from './../modules/user/user.service';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}
  async transform(value: string, metadata: ArgumentMetadata) {
    const result = await this.userService.findOneUser(value);
    console.log('UserByIdPipe result: ', result);
    return result;
  }
}

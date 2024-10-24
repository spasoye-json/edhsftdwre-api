import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

type MetaTypeFunction =
  | StringConstructor
  | BooleanConstructor
  | NumberConstructor
  | ArrayConstructor
  | ObjectConstructor;

function isMetaTypeFunction(a: unknown): a is MetaTypeFunction {
  return typeof a === 'function';
}

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }

    if (isMetaTypeFunction(metatype) && !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      console.error(errors);
      throw new BadRequestException('Bad Request');
    }
    return value;
  }

  private toValidate(metatype: MetaTypeFunction): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

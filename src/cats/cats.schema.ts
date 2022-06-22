import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Cat extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  catname: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop()
  imgUrl: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);

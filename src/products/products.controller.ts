import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { PaginationDto } from '../common/dto/pagination.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.natsClient.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.natsClient.send({ cmd: 'find_all_products' }, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    /**
     *  return this.productsClient.send({ cmd: 'find_one_product' }, { id })
     *      .pipe(
     *          catchError(err => {throw new RcpException(err)})
     *  );
     */
    try {
      const product = await firstValueFrom(
        this.natsClient.send({ cmd: 'find_one_product' }, { id }).pipe(
          catchError((err) => {
            throw new RpcException(err);
          }),
        ),
      );

      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.natsClient.send({ cmd: 'delete_product' }, { id });
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.natsClient
      .send(
        { cmd: 'updated_product' },
        {
          id,
          ...updateProductDto,
        },
      )
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}

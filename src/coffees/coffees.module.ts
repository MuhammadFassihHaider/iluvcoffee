import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavors } from './entities/flavor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavors])],
    controllers: [CoffeesController],
    providers: [CoffeesService],
})
export class CoffeesModule {}

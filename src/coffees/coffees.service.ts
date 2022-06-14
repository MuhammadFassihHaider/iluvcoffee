import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
  ) {}

  throwCoffeeNotFoundException(coffee: Coffee, id: number) {
    if (!coffee) {
      throw new NotFoundException(`Coffee of id: ${id} not found`);
    }
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = this.coffeeRepository.create(createCoffeeDto);
    return this.coffeeRepository.save(coffee);
  }

  findAll() {
    return this.coffeeRepository.find();
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({ where: { id } });
    this.throwCoffeeNotFoundException(coffee, id);
    return coffee;
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    /**
     * Sees if entity exists or not. If so, returns it with
     * the values passed. Otherwise, returns undefined
     */
    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeDto,
    });
    this.throwCoffeeNotFoundException(coffee, id);
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.coffeeRepository.findOne({ where: { id } });
    this.throwCoffeeNotFoundException(coffee, id);
    return this.coffeeRepository.remove(coffee);
  }
}

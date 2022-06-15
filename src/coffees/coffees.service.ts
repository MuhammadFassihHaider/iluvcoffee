import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavors } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavors)
        private readonly flavorRepository: Repository<Flavors>,
    ) {}

    private throwCoffeeNotFoundException(coffee: Coffee, id: number) {
        if (!coffee) {
            throw new NotFoundException(`Coffee of id: ${id} not found`);
        }
    }

    private async preloadFlavorByName(name: string) {
        const flavor = await this.flavorRepository.findOne({ where: { name } });
        if (flavor) {
            return flavor;
        }
        return this.flavorRepository.create({ name });
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map((flavorName) =>
                this.preloadFlavorByName(flavorName),
            ),
        );
        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors,
        });
        return this.coffeeRepository.save(coffee);
    }

    async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors =
            !!updateCoffeeDto.flavors &&
            (await Promise.all(
                updateCoffeeDto.flavors.map((flavorName) =>
                    this.preloadFlavorByName(flavorName),
                ),
            ));
        /**
         * Sees if entity exists or not. If so, returns it with
         * the values passed. Otherwise, returns undefined
         */
        const coffee = await this.coffeeRepository.preload({
            id,
            ...updateCoffeeDto,
            flavors,
        });
        this.throwCoffeeNotFoundException(coffee, id);
        return this.coffeeRepository.save(coffee);
    }

    async remove(id: number) {
        const coffee = await this.coffeeRepository.findOne({ where: { id } });
        this.throwCoffeeNotFoundException(coffee, id);
        return this.coffeeRepository.remove(coffee);
    }

    findAll() {
        return this.coffeeRepository.find({
            relations: ['flavors'],
        });
    }

    async findOne(id: number) {
        const coffee = await this.coffeeRepository.findOne({
            where: { id },
            relations: ['flavors'],
        });
        this.throwCoffeeNotFoundException(coffee, id);
        return coffee;
    }
}

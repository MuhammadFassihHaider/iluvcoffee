import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavors } from './flavor.entity';

@Entity()
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    brand: string;

    @JoinTable()
    @ManyToMany(() => Flavors, (flavors) => flavors.coffees, {
        cascade: ['insert', 'update'],
    })
    flavors: Flavors[];
}

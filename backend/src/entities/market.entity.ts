import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Chain } from '../types/chain';

@Entity('market')
export class Market {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: Chain })
  chainId: Chain;

  @Column({ type: 'bigint' })
  totalSupplyCents: number;

  @Column({ type: 'bigint' })
  totalBorrowCents: number;

  @CreateDateColumn()
  createdAt: Date;
}

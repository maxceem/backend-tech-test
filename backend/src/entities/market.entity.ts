import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { Chain } from '../types/chain';

@Entity('market')
@Index('idx_market_name', ['name'])
@Index('idx_market_chain_id', ['chainId'])
export class Market {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: Chain })
  chainId: Chain;

  @Column({ type: 'bigint' })
  totalSupplyCents: string;

  @Column({ type: 'bigint' })
  totalBorrowCents: string;

  @CreateDateColumn()
  createdAt: Date;
}

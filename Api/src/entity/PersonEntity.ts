import {
  Entity, Column, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn
} from 'typeorm'
import { BusinessPersonLocationEntity } from './BusinessPersonLocationEntity'
import { EncryptionTransformer } from 'typeorm-encrypted'
import { EncryptionTransformerObject } from '../setup/readEnv'

@Entity('persons')
export class PersonEntity {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({
    nullable: false,
    length: 255,
    transformer: new EncryptionTransformer(EncryptionTransformerObject)
  })
    name!: string

  @Column({
    nullable: true,
    length: 255,
    transformer: new EncryptionTransformer(EncryptionTransformerObject)
  })
    email!: string

  @Column({
    nullable: true,
    length: 255,
    transformer: new EncryptionTransformer(EncryptionTransformerObject)
  })
    phone_number!: string

  @OneToOne(() => BusinessPersonLocationEntity)
  @JoinColumn()
    businessPersonLocation!: BusinessPersonLocationEntity

  @CreateDateColumn()
    created_at!: Date

  @UpdateDateColumn()
    updated_at!: Date
}

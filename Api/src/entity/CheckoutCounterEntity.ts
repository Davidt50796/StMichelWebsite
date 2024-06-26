import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm'
import { MerchantEntity } from './MerchantEntity'
import { MerchantLocationEntity } from './MerchantLocationEntity'
import { MerchantLookupStatus } from '../../../shared-lib'
import { EncryptionTransformer } from 'typeorm-encrypted'
import { EncryptionTransformerObject } from '../setup/readEnv'

@Entity('checkout_counters')
export class CheckoutCounterEntity {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ nullable: true, length: 255 })
    description!: string

  @Column({ nullable: true, length: 512 })
    guid!: string

  @Column({ nullable: true, length: 255 })
    notification_number!: string

  @Column({ nullable: false, length: 255, default: 'BUSINESS' })
    alias_type!: string

  @Column({
    nullable: true,
    length: 255,
    transformer: new EncryptionTransformer(EncryptionTransformerObject)
  })
    alias_value!: string

  @Column({
    nullable: true,
    length: 255,
    transformer: new EncryptionTransformer(EncryptionTransformerObject)
  })
    merchant_account_number!: string

  @Column({ nullable: true })
    merchant_registry_id!: number

  @Column({ nullable: true })
    qr_code_link!: string

  // merchant_id
  @ManyToOne(
    () => MerchantEntity, merchant => merchant.checkout_counters,
    { onDelete: 'SET NULL' }
  )
    merchant!: MerchantEntity

  // merchant_location_id
  @ManyToOne(
    () => MerchantLocationEntity,
    merchantLocation => merchantLocation.checkout_counters,
    { onDelete: 'SET NULL' }
  )
    checkout_location!: MerchantLocationEntity

  @Column({
    type: 'simple-enum',
    enum: MerchantLookupStatus,
    nullable: false,
    default: MerchantLookupStatus.ACTIVE
  })
    merchant_status!: MerchantLookupStatus

  @CreateDateColumn()
    created_at!: Date

  @UpdateDateColumn()
    updated_at!: Date
}

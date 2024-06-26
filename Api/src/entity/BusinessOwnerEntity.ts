import {
  Entity, Column, ManyToMany
} from 'typeorm'
import { MerchantEntity } from './MerchantEntity'
import { BusinessOwnerIDType } from '../../../shared-lib'
import { PersonEntity } from './PersonEntity'
import { EncryptionTransformer } from 'typeorm-encrypted'
import { EncryptionTransformerObject } from '../setup/readEnv'

@Entity('business_owners')
export class BusinessOwnerEntity extends PersonEntity {
  @Column({
    type: 'simple-enum',
    enum: BusinessOwnerIDType,
    nullable: true,
    default: BusinessOwnerIDType.NATIONAL_ID
  })
    identificaton_type!: BusinessOwnerIDType

  @Column({
    nullable: true,
    length: 255,
    transformer: new EncryptionTransformer(EncryptionTransformerObject)
  })
    identification_number!: string

  @ManyToMany(
    () => MerchantEntity,
    merchant => merchant.business_owners
  )
    merchants!: MerchantEntity[]
}

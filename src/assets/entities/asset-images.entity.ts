import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "./asset.entity";

@Entity('productsaf_images')
export class AssetImage {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ name: 'productafId' })
  assetId: number;

  @ManyToOne(() => Asset, (asset) => asset.images)
  @JoinColumn({ name: 'productafId' })
  asset: Asset;
}

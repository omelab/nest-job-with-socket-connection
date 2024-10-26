import {
  Column,
  Model,
  Table,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'employees',
  timestamps: true, // Automatically manage created_at and updated_at
})
export class Employee extends Model<Employee> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  position?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  department?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  created_by?: string; // ID or username of the creator

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  updated_by?: string; // ID or username of the last updater

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  deleted_by?: string;

  @CreatedAt
  @Column({
    field: 'created_at',
    type: DataType.DATE,
    allowNull: false,
  })
  created_at!: Date;

  @UpdatedAt
  @Column({
    field: 'updated_at',
    type: DataType.DATE,
    allowNull: false,
  })
  updated_at!: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deleted_at?: Date;
}

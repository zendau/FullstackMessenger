import {MigrationInterface, QueryRunner} from "typeorm";

export class roles1656512604647 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query("INSERT INTO `role` (`id`, `value`, `desc`, `accessLevel`) VALUES (1, 'admin', 'admin role', 2), (2, 'user', 'user role', 1);")
    }

    public async down(queryRunner: QueryRunner): Promise<void> { 
        console.log('clear roles')
    }

}

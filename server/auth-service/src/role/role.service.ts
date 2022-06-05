import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/users.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserRole } from './userRole.entity';
import IEditUserData from './interfaces/IEditUserData';
import { Role } from './role.entity';
import { userRoleDataDTO } from './dto/userRole.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private UserRoleRepository: Repository<UserRole>,
  ) {}

  async addNewRole(roleData: Role) {
    const resInsered = await this.rolesRepository.save(roleData);
    return resInsered;
  }

  async updateRole(roleData: IEditUserData) {
    const resUpdate = await this.rolesRepository
      .createQueryBuilder()
      .update()
      .set({
        value: roleData.value,
        desc: roleData.desc,
        accessLevel: roleData.accessLevel,
      })
      .where(`id = ${roleData.id}`)
      .execute();
    return !!resUpdate.affected;
  }

  async getRoles() {
    const allRoles = await this.rolesRepository.createQueryBuilder().getMany();
    return allRoles;
  }

  async getRoleByName(name: string) {
    const roleData = await this.rolesRepository
      .createQueryBuilder()
      .where('value = :name', { name })
      .getOne();

    return roleData;
  }

  async getRoleById(id: number) {
    const roleData = await this.rolesRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();

    return roleData;
  }

  async deleteRole(roleId: number) {
    const resDeleted = await this.rolesRepository
      .createQueryBuilder()
      .delete()
      .where(`id = ${roleId}`)
      .execute();
    return !!resDeleted.affected;
  }

  addUserRole(userRoleData: userRoleDataDTO, manager: EntityManager): any;
  addUserRole(userRoleData: userRoleDataDTO): any;

  async addUserRole(userRoleData?: userRoleDataDTO, manager?: EntityManager) {
    const res = await manager.save(UserRole, userRoleData);
    return res;
  }

  async editUserRole(userRoleData: UserRole) {
    console.log(userRoleData);
    const resUpdate = await this.UserRoleRepository.createQueryBuilder()
      .update()
      .set({
        roleId: userRoleData.roleId,
      })
      .where(`userId = ${userRoleData.userId}`)
      .execute();
    return resUpdate;
  }

  async getUsersRole(roleId: number) {
    const res = await this.UserRoleRepository.createQueryBuilder('ur')
      .select(['ur.id', 'ur.role', 'ur.user'])
      .innerJoinAndSelect('ur.role', 'role')
      .innerJoinAndSelect('ur.user', 'user')
      .where(`role.id = ${roleId}`)
      .getMany();
    console.log(res);
    return res;
  }
}

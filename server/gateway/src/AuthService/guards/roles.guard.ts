import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { Role } from '../enum/role.enum';


const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      debugger;
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      return role <= user?.role.accessLevel;
    }
  }
 
  return mixin(RoleGuardMixin);
}
 
export default RoleGuard;
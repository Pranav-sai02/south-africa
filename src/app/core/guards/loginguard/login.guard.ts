import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/authservice/auth.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};

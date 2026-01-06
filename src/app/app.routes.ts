import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { UserLayoutComponent } from './layouts/user-layout/user-layout';

import { VehicleListingComponent } from './features/vehicles/vehicle-listing/vehicle-listing';
import { VehicleDetailComponent } from './features/vehicles/vehicle-detail/vehicle-detail';

import { GuestGuard } from './core/guards/guest.guard';
import { UserGuard } from './core/guards/user.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { DummyComponent } from './shared/components/dummy/dummy';
import { MyBookingsComponent } from './features/vehicles/my-bookings/my-bookings';
import { GetAllBookings } from './features/vehicles/get-all-bookings/get-all-bookings';

export const routes: Routes = [

  /* ---------------- AUTH (NO LAYOUT) ---------------- */
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [GuestGuard]
  },

  /* ---------------- USER LAYOUT ---------------- */
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [UserGuard],
    children: [
      {
        path: 'vehicles',
        component: VehicleListingComponent
      },
      {
        path: 'vehicles/:id',
        component: VehicleDetailComponent
      },
      {
        path: '',
        redirectTo: 'vehicles',
        pathMatch: 'full'
      },
      {
        path: 'my-bookings',
        component: MyBookingsComponent
      }
    ]
  },

  /* ---------------- ADMIN LAYOUT ---------------- */
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'dashboard',
        component: VehicleListingComponent
      },
      {
        path: 'view-all-bookings',
        component: GetAllBookings
      }
    ]
  },

  {
    path: 'dummy',
    component: DummyComponent
  },

  /* ---------------- FALLBACK ---------------- */
  {
    path: '**',
    redirectTo: '/dummy'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
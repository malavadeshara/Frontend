import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/components/footer/footer";
import { AuthRoutingModule } from "../../features/auth/auth-routing.module";
import { NavbarComponent } from "../../shared/components/navbar/navbar";

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css'],
  imports: [FooterComponent, AuthRoutingModule, NavbarComponent]
})
export class AdminLayoutComponent {}
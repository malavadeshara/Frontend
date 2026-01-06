import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/components/footer/footer";
import { AuthRoutingModule } from "../../features/auth/auth-routing.module";
import { NavbarComponent } from "../../shared/components/navbar/navbar";

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.html',
  styleUrls: ['./user-layout.css'],
  imports: [FooterComponent, AuthRoutingModule, NavbarComponent]
})
export class UserLayoutComponent {}
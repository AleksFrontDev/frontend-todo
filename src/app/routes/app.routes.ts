import { Routes } from "@angular/router";
import { LoginComponent } from "../components/login/login.component";
import { RegistrationComponent } from "../components/registration/registration.component";
import { TaskListComponent } from "../components/task/task.component";
import { AuthGuard } from "../guards/auth.guard";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  {
    path: 'tasks',
    component: TaskListComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: '**', redirectTo: '/tasks' },
];

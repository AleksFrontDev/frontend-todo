import { bootstrapApplication } from '@angular/platform-browser';
import { TaskListComponent } from './app/task.component';
import { taskConfig } from './app/task.config';

bootstrapApplication(TaskListComponent, taskConfig)
  .catch((err) => console.error(err));

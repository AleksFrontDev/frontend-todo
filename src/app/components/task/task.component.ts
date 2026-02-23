import {
  Component,
  OnInit,
  inject
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { Task, CreateTask, UpdateTask } from '../../models/task.interface';
import { TaskService } from '../../services/task.service';
import { LoginComponent } from "../login/login.component";

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginComponent],
  templateUrl: './task.component.html',
  styleUrls: ['./styles/task.component.css'],
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);

  tasks: Task[] = [];
  newTaskTitle = '';
  loading = false;
  errorMessage = '';
  editingTaskId: number | null = null;
  editTaskTitle = '';
  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.errorMessage = '';

    this.taskService.getAllTasks().subscribe({
      next: (tasks: any) => {
        this.tasks = tasks;
        this.calculateStats();
        this.loading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Не удалось загрузить задачи: ' + error.message;
        this.loading = false;
        console.error('Ошибка загрузки задач:', error);
      }
    });
  }

  calculateStats(): void {
    this.totalTasks = this.tasks.length;
    this.completedTasks = this.tasks.filter(t => t.completed).length;
    this.pendingTasks = this.totalTasks - this.completedTasks;
  }

  createTask(): void {
    if (!this.newTaskTitle.trim()) {
      this.errorMessage = 'Введите название задачи';
      return;
    }

    const newTask: CreateTask = {
      title: this.newTaskTitle.trim(),
      completed: false
    };

    this.taskService.createTask(newTask).subscribe({
      next: (task: any) => {
        this.tasks.unshift(task);
        this.calculateStats();
        this.newTaskTitle = '';
        this.errorMessage = '';
      },
      error: (error: any) => {
        this.errorMessage = 'Не удалось создать задачу: ' + error.message;
      }
    });
  }

  toggleTask(id: number): void {
    this.taskService.toggleTask(id).subscribe({
      next: (updatedTask: any) => {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
          this.calculateStats();
        }
      },
      error: (error: any) => {
        this.errorMessage = 'Не удалось обновить задачу: ' + error.message;
      }
    });
  }

  startEdit(task: Task): void {
    this.editingTaskId = task.id;
    this.editTaskTitle = task.title;
  }

  saveEdit(id: number): void {
    if (!this.editTaskTitle.trim()) {
      this.errorMessage = 'Название не может быть пустым';
      return;
    }

    const updateData: UpdateTask = {
      title: this.editTaskTitle.trim()
    };

    this.taskService.updateTask(id, updateData).subscribe({
      next: (updatedTask: any) => {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.cancelEdit();
        this.errorMessage = '';
      },
      error: (error: any) => {
        this.errorMessage = 'Не удалось обновить задачу: ' + error.message;
      }
    });
  }

  cancelEdit(): void {
    this.editingTaskId = null;
    this.editTaskTitle = '';
  }

  deleteTask(id: number): void {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.calculateStats();
        this.errorMessage = '';
      },
      error: (error: any) => {
        this.errorMessage = 'Не удалось удалить задачу: ' + error.message;
      }
    });
  }

  getTaskClasses(completed: boolean): any {
    return {
      'completed': completed,
      'pending': !completed
    };
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}

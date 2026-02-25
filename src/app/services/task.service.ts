import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Task, CreateTask, UpdateTask } from '../models/task.interface';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  // Получить все задачи
  getAllTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Создать задачу
  createTask(task: CreateTask): Observable<Task> {
    return this.http
      .post<Task>(this.apiUrl, task)
      .pipe(catchError(this.handleError));
  }

  // Обновить задачу (полностью)
  updateTask(id: number, task: UpdateTask): Observable<Task> {
    return this.http
      .put<Task>(`${this.apiUrl}/${id}`, task)
      .pipe(catchError(this.handleError));
  }

  // Частично обновить задачу
  patchTask(id: number, task: UpdateTask): Observable<Task> {
    return this.http
      .patch<Task>(`${this.apiUrl}/${id}`, task)
      .pipe(catchError(this.handleError));
  }

  // Удалить задачу
  deleteTask(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Переключить статус задачи
  toggleTask(id: number): Observable<Task> {
    return this.http
      .patch<Task>(`${this.apiUrl}/${id}/toggle`, {})
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Произошла ошибка';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      errorMessage = `Код ошибки: ${error.status}\nСообщение: ${error.message}`;

      if (error.error && error.error.error) {
        errorMessage = error.error.error;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { Todo } from '../../model/todo.model';
import { TodoService } from '../../service/todo.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  providers: [TodoService],
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent {
  @Output() todoAdded = new EventEmitter<Todo>();
  todoForm: FormGroup;

  constructor(private fb: FormBuilder, private todoService: TodoService) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const newTodo: Todo = {
        id: 0, // ID will be assigned by the server
        ...this.todoForm.value
      };

      this.todoService.addTodo(newTodo).subscribe(
        (addedTodo) => {
          this.todoAdded.emit(addedTodo);
          this.todoForm.reset();
        },
        (error) => {
          console.error('Error adding todo:', error);
        }
      );
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { Todo } from '../../model/todo.model';
import { TodoService } from '../../service/todo.service';
import { CommonModule, NgFor } from '@angular/common';;
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(
      (todos) => {
        this.todos = todos;
        this.filterTodos();
      },
      (error) => {
        console.error('Error fetching todos:', error);
      }
    );
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe(
      () => {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.filterTodos();
      },
      (error) => {
        console.error('Error deleting todo:', error);
      }
    );
  }

  filterTodos(): void {
    this.filteredTodos = this.todos.filter(todo =>
      todo.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  get pagedTodos(): Todo[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredTodos.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTodos.length / this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  onSearch(): void {
    this.filterTodos();
  }
}

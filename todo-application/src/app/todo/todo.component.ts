import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatMenuModule } from "@angular/material/menu"
import  { TodoService } from "../todo.service"
import type { Todo } from "../todo.model"

interface ExtendedTodo extends Todo {
  pinned?: boolean
  description?: string
}

@Component({
  selector: "app-todo",
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatCardModule, MatIconModule, MatMenuModule],
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.css"],
})
export class TodoComponent implements OnInit {
  todos: ExtendedTodo[] = []
  newTodoTitle = ""
  showMenu = false
  activeTaskIndex: number | null = null

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((data) => {
      // Initialize with sample data that matches the image
      this.todos = [
        {
          id: 1,
          userId: 1,
          title: "Getting an invite for dribbble",
          description: "one of my goals in 2017",
          completed: true,
          pinned: true,
        },
        {
          id: 2,
          userId: 1,
          title: "11am meeting",
          description: "",
          completed: false,
          pinned: false,
        },
        {
          id: 3,
          userId: 1,
          title: "Finish visual Design",
          description: "",
          completed: true,
          pinned: false,
        },
        {
          id: 4,
          userId: 1,
          title: "Do research",
          description: "E-book readers in iOS, Android",
          completed: false,
          pinned: false,
        },
        {
          id: 5,
          userId: 1,
          title: "Reading About Face 4",
          description: "",
          completed: false,
          pinned: false,
        },
        {
          id: 6,
          userId: 1,
          title: "Do pilates",
          description: "",
          completed: false,
          pinned: false,
        },
      ]
    })
  }

  toggleMenu(index: number) {
    this.activeTaskIndex = index
    this.showMenu = !this.showMenu || this.activeTaskIndex !== index
  }

  togglePin(todo: ExtendedTodo) {
    todo.pinned = !todo.pinned
    this.updateTodo(todo)
    this.showMenu = false
  }

  toggleComplete(todo: ExtendedTodo) {
    todo.completed = !todo.completed
    this.updateTodo(todo)
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return

    const todo: Partial<ExtendedTodo> = {
      userId: 1,
      title: this.newTodoTitle,
      completed: false,
      pinned: false,
      description: "",
    }

    this.todoService.addTodo(todo).subscribe((created) => {
      const extendedTodo: ExtendedTodo = {
        ...created,
        pinned: false,
        description: "",
      }
      this.todos.unshift(extendedTodo)
      this.newTodoTitle = ""
    })
  }

  updateTodo(todo: ExtendedTodo) {
    this.todoService.updateTodo(todo.id, todo).subscribe()
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== id)
      this.showMenu = false
    })
  }

  addMemo(todo: ExtendedTodo) {
    // Simple implementation - in a real app, you might want a dialog
    const memo = prompt("Add a memo:", todo.description || "")
    if (memo !== null) {
      todo.description = memo
      this.updateTodo(todo)
    }
    this.showMenu = false
  }
}

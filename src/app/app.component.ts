import {
  Component,
  computed,
  signal,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DialogComponent } from './dialogs/dialog/dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {
    const element = document.body;
    element.classList.add('theme-light');

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }
  title = 'test';
  array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  toggleTheme() {
    const element = document.body;
    element.classList.toggle('theme-dark');
    element.classList.toggle('theme-light');
  }

  readonly task = signal<Task>({
    name: 'Parent task',
    completed: false,
    subtasks: [
      { name: 'Child task 1', completed: false },
      { name: 'Child task 2', completed: false },
      { name: 'Child task 3', completed: false },
    ],
  });

  readonly partiallyComplete = computed(() => {
    const task = this.task();
    if (!task.subtasks) {
      return false;
    }
    return (
      task.subtasks.some((t: any) => t.completed) &&
      !task.subtasks.every((t: any) => t.completed)
    );
  });

  update(completed: boolean, index?: number) {
    this.task.update((task: any) => {
      if (index === undefined) {
        task.completed = completed;
        task.subtasks?.forEach((t: any) => (t.completed = completed));
      } else {
        task.subtasks![index].completed = completed;
        task.completed = task.subtasks?.every((t: any) => t.completed) ?? true;
      }
      return { ...task };
    });
  }

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly fruits = signal<Fruit[]>([
    { name: 'Lemon' },
    { name: 'Lime' },
    { name: 'Apple' },
  ]);
  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.update((fruits) => [...fruits, { name: value }]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: Fruit): void {
    this.fruits.update((fruits) => {
      const index = fruits.indexOf(fruit);
      if (index < 0) {
        return fruits;
      }

      fruits.splice(index, 1);
      this.announcer.announce(`Removed ${fruit.name}`);
      return [...fruits];
    });
  }

  edit(fruit: Fruit, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(fruit);
      return;
    }

    // Edit existing fruit
    this.fruits.update((fruits) => {
      const index = fruits.indexOf(fruit);
      if (index >= 0) {
        fruits[index].name = value;
        return [...fruits];
      }
      return fruits;
    });
  }
  // Mat-chip
  addChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.update((fruits) => [...fruits, { name: value }]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeChip(fruit: Fruit): void {
    this.fruits.update((fruits) => {
      const index = fruits.indexOf(fruit);
      if (index < 0) {
        return fruits;
      }

      fruits.splice(index, 1);
      this.announcer.announce(`Removed ${fruit.name}`);
      return [...fruits];
    });
  }

  editChip(fruit: Fruit, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(fruit);
      return;
    }

    // Edit existing fruit
    this.fruits.update((fruits) => {
      const index = fruits.indexOf(fruit);
      if (index >= 0) {
        fruits[index].name = value;
        return [...fruits];
      }
      return fruits;
    });
  }

  // Date picker
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };
  // Dialog
  readonly dialog = inject(MatDialog);
  openDialog() {
    this.dialog.open(DialogComponent, {
      data: { name: 'Angular' },
    });
  }
  // panel expension
  readonly panelOpenState = signal(false);

  // email

  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }
}

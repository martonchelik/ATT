import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed, ViewChild, OnInit,
} from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/services/storage.service';
import { StorageSchema } from 'src/app/models/storage-schema.model';
import { TaskPriority, TaskStatus } from 'src/app/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskCategoryComponent } from '../task-category/task-category.component';
import { UtilsService } from 'src/app/services/utils.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';
import {
  DATETIME_FORMAT,
  DIALOG_WIDTH,
  TASK_PRIORITY_LABELS,
} from 'src/app/constants/constants';
import { A11yModule } from '@angular/cdk/a11y';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { map } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';import {
  NGX_MAT_DATE_FORMATS,
  NgxMatDateAdapter,
  NgxMatDatetimePickerModule,
  NgxMatDatetimepicker,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
import {NgxMatMomentAdapter, NgxMatMomentModule} from "@angular-material-components/moment-adapter";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";


@Component({
  selector: 'app-task-board',
  standalone: true,
  providers: [
    {
      provide: [NgxMatDateAdapter, MatDatepickerModule],
      useClass: NgxMatMomentAdapter,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-Au'},
  ],
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
  imports: [
    MatNativeDateModule,
    CommonModule,
    TaskCardComponent,
    TaskCategoryComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxMatMomentModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatDialogModule,
    EditTaskDialogComponent,
    A11yModule,
    MatDatepickerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskBoardComponent {
  TaskStatus = TaskStatus;
  taskPriorities = this.utils.getEnumNumberValues(TaskPriority);
  priorityLabels = TASK_PRIORITY_LABELS;

  titleFilterControl = new FormControl<string>('', {
    nonNullable: true,
  });
  assigneeFilterControl = new FormControl<string>('', {
    nonNullable: true,
  });
  prioritiesFilterControl = new FormControl<number[]>([1, 2, 3], {
    nonNullable: true,
  });
  dueFilterControl = new FormControl<Date|null>(null);

  titleFilter = this.utils.toSignalFromControl(this.titleFilterControl);

  assigneeFilter = this.utils.toSignalFromControl(this.assigneeFilterControl);

  prioritiesFilter = this.utils.toSignalFromControl(this.prioritiesFilterControl);

  dueFilter = this.utils.toSignalFromControl(this.dueFilterControl);

  tasks = toSignal(
    this.storage.getItemObservable('tasks').pipe(
      takeUntilDestroyed(this.destroyRef),
      map((tasks) => tasks || [])
    ),
    { requireSync: true }
  );

  filteredTasks = computed(this.computeFilteredTasks.bind(this));

  titleFilterActive = computed(() => !!this.titleFilter().length);

  assigneeFilterActive = computed(() => !!this.assigneeFilter().length);

  prioritiesFilterActive = computed(() => this.prioritiesFilter().length < 3);

  dueFilterActive = computed(() => !!this.dueFilter());

  toDoTasks = computed(() =>
    this.filteredTasks()?.filter((task) => task.status === TaskStatus.ToDo)
  );

  inProgressTasks = computed(() =>
    this.filteredTasks().filter((task) => task.status === TaskStatus.InProgress)
  );

  completedTasks = computed(() =>
    this.filteredTasks().filter((task) => task.status === TaskStatus.Completed)
  );

  constructor(
    private destroyRef: DestroyRef,
    private storage: StorageService<StorageSchema>,
    private utils: UtilsService,
    private dialog: MatDialog
  ) {
    this.utils.initSvgIcons(['add', 'close', 'reset']);
  }

  clearFilters(
    titleFilter: boolean = true,
    assigneeFilter: boolean = true,
    dueFilter: boolean = true,
    prioritiesFilter: boolean = true,
  ) {
    if (titleFilter) this.titleFilterControl.reset();
    if (assigneeFilter) this.assigneeFilterControl.reset();
    if (dueFilter) this.dueFilterControl.reset();
    if (prioritiesFilter) this.prioritiesFilterControl.reset([1, 2, 3]);

  }

  addTask() {
    this.dialog.open(EditTaskDialogComponent, {
      width: DIALOG_WIDTH,
      data: { isEdit: false },
      disableClose: true,
    });
  }

  private computeFilteredTasks() {
    const tasks = this.tasks();
    const titleFilter = this.titleFilter().trim();
    const assigneeFilter = this.assigneeFilter().trim();
    const dueFilter = this.dueFilter();
    const prioritiesFilter = this.prioritiesFilter();


    if (!titleFilter && !assigneeFilter && !dueFilter && prioritiesFilter.length === 3) {
      return tasks;
    }

    return tasks?.filter((task) => {
      return (
        (!titleFilter ||
          task.title
            .toLocaleUpperCase()
            .includes(titleFilter.toLocaleUpperCase())) &&
        (!assigneeFilter ||
          task.assignee
            .toLocaleUpperCase()
            .includes(assigneeFilter.toLocaleUpperCase())) &&
        (!dueFilter ||
          task.dueDate == new Date(dueFilter.toISOString()).toLocaleDateString('en-US',{
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })) &&
        (prioritiesFilter.length === 3 ||
          prioritiesFilter.includes(task.priority))

      );
    });
  }
  @ViewChild('dueDatePicker', {
    static: true,
  })
  dueDateRef!: NgxMatDatetimepicker<any>;


}

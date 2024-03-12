import { NgxMatDateFormats } from '@angular-material-components/datetime-picker';
import { TaskPriority, TaskStatus } from '../models/task.model';
import { v4 } from 'uuid';
import moment from 'moment';
import {MatDateFormats} from "@angular/material/core";

export const DATETIME_FORMAT: NgxMatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

export const MAT_DATETIME_FORMAT: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMM YYYY',
  },
};

/*export const MAT_DATETIME_FORMAT: MatDateFormats = {
  parse: {
    dateInput: 'L',
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM YYYY',
  },
};*/



export const DIALOG_WIDTH = '640px';

export const TASK_STATUS_LABELS = ['К выполнению', 'В процессе', 'Выполнено\n'];

export const TASK_PRIORITY_LABELS = ['Высокий', 'Средний', 'Низкий'];

export const DATETIME_OUTPUT_FORMAT = 'DD.MM.YYYY';

export function mockTasks() {
  return [
    {
      id: v4(),
      title: 'Начать работать',
      assignee: 'martonchelik',
      description: 'Устроиться frontend разработчиком ',
      status: TaskStatus.ToDo,
      priority: TaskPriority.High,
      createdAt: moment().format('L'),
      dueDate: moment().add(1, 'days').format('L'),
    },
    {
      id: v4(),
      title: 'Стать сеньором',
      assignee: 'martonchelik',
      description: '',
      status: TaskStatus.InProgress,
      priority: TaskPriority.Medium,
      createdAt: moment().format('L'),
      dueDate: moment().add(2, 'days').format('L'),
    },
    {
      id: v4(),
      title: 'Создать менеджер задач',
      assignee: 'martonchelik',
      description: 'Необходимо создать мини-тасктреккер по типу Asana ',
      status: TaskStatus.Completed,
      priority: TaskPriority.Low,
      createdAt: moment().format('L'),
      dueDate: moment().add(2, 'days').format('L'),
    },
    {
      id: v4(),
      title: 'Пригласить martonchelik на собеседование',
      assignee: 'HR',
      description: '',
      status: TaskStatus.ToDo,
      priority: TaskPriority.High,
      createdAt: moment().format('L'),
      dueDate: moment().add(2, 'days').format('L'),
    },
  ];
}

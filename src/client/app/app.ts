import { Observable } from 'rxjs';
import { createTodoItem } from './lib/lib';

const $input = <HTMLInputElement>document.querySelector('.todo-val');
const $list = <HTMLLIElement>document.querySelector('.list-group');
const $add = document.querySelector('.button-add');

const enter$ = Observable.fromEvent<KeyboardEvent>($input, 'keydown')
	.filter(r => r.keyCode === 13);

const clickAdd$ = Observable.fromEvent<MouseEvent>($add, 'click');

const input$ = enter$.merge(clickAdd$);

const app$ = input$
	.map(() => $input.value)
	.filter(r => r !== '')
	.map(createTodoItem)
	.do((ele: HTMLLIElement) => { 
		$list.appendChild(ele);
		$input.value = '';
	})
	.mergeMap($todoItem => {
		return Observable.fromEvent<MouseEvent>($todoItem, 'click')
		.filter(e => e.target === $todoItem)
		.mapTo($todoItem);
	})
	.do(($todoItem: HTMLElement) => {
		if ($todoItem.classList.contains('done')) {
			$todoItem.classList.remove('done');
		} else {
			$todoItem.classList.add('done');
		}
	})
	.do(r => console.log(r));

app$.subscribe();


import { MathValidators } from './../math-validators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { delay, filter, scan } from 'rxjs/operators';

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.css'],
})
export class EquationComponent implements OnInit {
  mathForm: FormGroup;
  a: FormControl;
  b: FormControl;
  answer: FormControl;
  secondsPerSolution = 0;
  constructor() {}

  ngOnInit(): void {
    this.a = new FormControl(this.randomNumber());
    this.b = new FormControl(this.randomNumber());
    this.answer = new FormControl('');
    this.mathForm = new FormGroup(
      {
        a: this.a,
        b: this.b,
        answer: this.answer,
      },
      [MathValidators.addition('answer', 'a', 'b')]
    );

    this.mathForm.statusChanges
      .pipe(
        filter((value) => {
          return value === 'VALID';
        }),
        delay(1000),
        scan(
          (acc) => {
            return {
              numberSolved: acc.numberSolved + 1,
              startTime: acc.startTime,
            };
          },
          { numberSolved: 0, startTime: new Date() }
        )
      )
      .subscribe(({ numberSolved, startTime }) => {
        this.secondsPerSolution =
          (new Date().getTime() - startTime.getTime()) / numberSolved / 1000;
        this.mathForm.setValue({
          a: this.randomNumber(),
          b: this.randomNumber(),
          answer: '',
        });
      });
  }

  get numA() {
    return this.mathForm.value.a;
  }

  get numB() {
    return this.mathForm.value.b;
  }

  randomNumber(): number {
    return Math.floor(Math.random() * 10);
  }
}

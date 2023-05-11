import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-b-cargo',
  templateUrl: './b-cargo.component.html',
  styleUrls: ['./b-cargo.component.scss'],
})
export class BCargoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  date = new FormControl(new Date());

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.date.value);
  }
}

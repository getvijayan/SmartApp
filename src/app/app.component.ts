import { Component } from '@angular/core';
import { User } from './_models';
import { UserService } from './_services';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html'
})



export class AppComponent {
    currentUser: User;
    users: User[] = [];

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }}
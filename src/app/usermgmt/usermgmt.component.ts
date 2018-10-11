import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from '../_services';

@Component({
  selector: 'app-usermgmt',
  templateUrl: './usermgmt.component.html',
  styleUrls: ['./usermgmt.component.css']
})
export class UsermgmtComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    currentUser: User;
    users: User[] = [];
    updateUser: User;
    showNew: Boolean = false;
    showNewButton:Boolean = true;
    submitType:string = 'Save';
    updateUserId:number;
    constructor(private userService: UserService,
        private formBuilder: FormBuilder,
        private router: Router,
        private alertService: AlertService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
    }
    ngOnInit() {
        this.loadAllUsers();
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
        // convenience getter for easy access to form fields
        get f() { return this.registerForm.controls; }
    addNew() {
        this.submitType ='Save';
            
            this.showNew = true;
            this.showNewButton = false;
            

            
    }
    onEdit(id: number) {
        this.showNew = true;
        this.showNewButton = false;
        this.updateUser= new User;
        
        this.updateUser = Object.assign({}, this.users[id]);
        this.registerForm.setValue({
            firstName: this.updateUser.firstName,
            lastName: this.updateUser.lastName,
            username: this.updateUser.username,
            password: this.updateUser.password
        }) 
        this.updateUserId = this.updateUser.id;
        this.submitType ='Update';
        
    }
    deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => { 
            this.loadAllUsers() 
        });
    }
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        if (this.submitType === 'Save'){
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('User Added', true);
                    /*this.router.navigate(['/usermgmt']);*/
                    this.loading = false;
                    this.showNew = false;
                    this.showNewButton= true;
                    this.loadAllUsers();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
            }
            else{this.userService.update(this.updateUserId,this.registerForm.value)
                .pipe(first())
                .subscribe(
                    data => {
                        this.alertService.success('User updated', true);
                        /*this.router.navigate(['/usermgmt']);*/
                        this.loading = false;
                        this.showNew = false;
                        this.showNewButton= true;
                        this.loadAllUsers();
                    },
                    error => {
                        this.alertService.error(error);
                        this.loading = false;
                    });

            }
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => { 
            this.users = users; 
        });
    }
    onCancel(){
    this.showNew = false;
    this.showNewButton= true;
    }

}
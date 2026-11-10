import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Exchange } from '../../services/exchange';
import { User } from '../../services/user';
import { Skill } from '../../services/skill';

@Component({
  selector: 'app-exchange-requests',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exchange-requests.html',
  styleUrl: './exchange-requests.css'
})
export class ExchangeRequests implements OnInit {

  private exchangeService = inject(Exchange);
  private userService = inject(User);
  private skillService = inject(Skill);
  private fb = inject(FormBuilder);

  requests: any[] = [];
  users: any[] = [];
  skills: any[] = [];

  totalRequests = 0;
  pendingRequests = 0;
  acceptedRequests = 0;
  rejectedRequests = 0;

  requestForm = this.fb.group({
    sender: ['', Validators.required],
    receiver: ['', Validators.required],
    offeredSkill: ['', Validators.required],
    requestedSkill: ['', Validators.required],
    status: ['Pending']
  });

  ngOnInit(): void {
    this.loadRequests();
    this.loadUsers();
    this.loadSkills();
  }

  loadRequests() {
    this.exchangeService.getAllRequests().subscribe({
      next: (data: any) => {

        this.requests = data;

        this.totalRequests = data.length;

        this.pendingRequests = data.filter(
          (r: any) => r.status === 'Pending'
        ).length;

        this.acceptedRequests = data.filter(
          (r: any) => r.status === 'Accepted'
        ).length;

        this.rejectedRequests = data.filter(
          (r: any) => r.status === 'Rejected'
        ).length;

      },
      error: (err) => console.error(err)
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        console.log("Users =>", data);
        this.users = data;
      },
      error: (err) => console.error(err)
    });
  }

  loadSkills() {
    this.skillService.getSkills().subscribe({
      next: (data: any) => {
        console.log("Skills =>", data);
        this.skills = data;
      },
      error: (err) => console.error(err)
    });
  }

  createRequest() {

    if (this.requestForm.invalid) return;

    this.exchangeService.createRequest(this.requestForm.getRawValue()).subscribe({

      next: () => {

        alert('Exchange Request Created Successfully');

        this.requestForm.reset({
          status: 'Pending'
        });

        this.loadRequests();

      },

      error: (err) => console.error(err)

    });

  }

  updateStatus(id: string, status: string) {

    this.exchangeService.updateRequest(id, { status }).subscribe({

      next: () => {

        alert(`Request ${status}`);

        this.loadRequests();

      },

      error: (err) => console.error(err)

    });

  }

  deleteRequest(id: string) {

    if (!confirm('Delete this request?')) return;

    this.exchangeService.deleteRequest(id).subscribe({

      next: () => this.loadRequests(),

      error: (err) => console.error(err)

    });

  }

}
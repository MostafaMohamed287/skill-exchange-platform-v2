import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Exchange } from '../../services/exchange';
import { User } from '../../services/user';
import { Skill } from '../../services/skill';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-exchange-requests',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './exchange-requests.html',
  styleUrl: './exchange-requests.css'
})
export class ExchangeRequests implements OnInit {

  private exchangeService = inject(Exchange);
  private userService = inject(User);
  private skillService = inject(Skill);
  private fb = inject(FormBuilder);
  auth = inject(Auth);

  allRequests = signal<any[]>([]);
  users = signal<any[]>([]);
  skills = signal<any[]>([]);
  receiverId = signal('');
  feedback = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  // id المستخدم المسجل (هو الـ sender تلقائي)
  myId = computed<string | undefined>(() => this.auth.user()?._id);

  // الطلبات اللي تخصني بس (أنا باعتها أو مستقبلها)
  requests = computed(() =>
    this.allRequests().filter(r =>
      r.sender?._id === this.myId() || r.receiver?._id === this.myId()
    )
  );

  totalRequests = computed(() => this.requests().length);
  pendingRequests = computed(() => this.requests().filter(r => r.status === 'Pending').length);
  acceptedRequests = computed(() => this.requests().filter(r => r.status === 'Accepted').length);
  rejectedRequests = computed(() => this.requests().filter(r => r.status === 'Rejected').length);

  // الـ receiver يتختار من باقي المستخدمين (من غيري)
  otherUsers = computed(() => this.users().filter(u => u._id !== this.myId()));

  // Offered Skill = من السكيلز بتاعتي
  mySkills = computed(() => this.skills().filter(s => s.owner?._id === this.myId()));

  // Requested Skill = من سكيلز الشخص اللي اخترته
  receiverSkills = computed(() => this.skills().filter(s => s.owner?._id === this.receiverId()));

  requestForm = this.fb.nonNullable.group({
    receiver: ['', Validators.required],
    offeredSkill: ['', Validators.required],
    requestedSkill: ['', Validators.required],
    message: ['']
  });

  constructor() {
    this.requestForm.controls.receiver.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(id => {
        this.receiverId.set(id);
        this.requestForm.controls.requestedSkill.setValue('');
      });
  }

  ngOnInit(): void {
    this.loadRequests();
    this.loadUsers();
    this.loadSkills();
  }

  isReceiver(request: any): boolean {
    return request.receiver?._id === this.myId();
  }

  loadRequests() {
    this.exchangeService.getAllRequests().subscribe({
      next: (data: any) => this.allRequests.set(data),
      error: (err) => console.error(err)
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data: any) => this.users.set(data),
      error: (err) => console.error(err)
    });
  }

  loadSkills() {
    this.skillService.getSkills().subscribe({
      next: (data: any) => this.skills.set(data),
      error: (err) => console.error(err)
    });
  }

  createRequest() {
    if (this.requestForm.invalid || !this.myId()) {
      this.feedback.set({ type: 'error', text: 'Please choose a receiver and both skills.' });
      return;
    }

    const payload = {
      sender: this.myId(),
      ...this.requestForm.getRawValue()
    };

    this.exchangeService.createRequest(payload).subscribe({
      next: () => {
        this.feedback.set({ type: 'success', text: 'Exchange request sent successfully.' });

        this.requestForm.reset({
          receiver: '',
          offeredSkill: '',
          requestedSkill: '',
          message: ''
        });

        this.loadRequests();
      },
      error: (err) => {
        this.feedback.set({
          type: 'error',
          text: err.error?.message || 'Failed to send the request.'
        });
      }
    });
  }

  updateStatus(id: string, status: string) {
    this.exchangeService.updateRequest(id, { status }).subscribe({
      next: () => {
        this.feedback.set({ type: 'success', text: `Request ${status.toLowerCase()}.` });
        this.loadRequests();
      },
      error: (err) => {
        this.feedback.set({
          type: 'error',
          text: err.error?.message || 'Failed to update the request.'
        });
      }
    });
  }

  deleteRequest(id: string) {
    if (!confirm('Delete this request?')) return;

    this.exchangeService.deleteRequest(id).subscribe({
      next: () => this.loadRequests(),
      error: (err) => {
        this.feedback.set({
          type: 'error',
          text: err.error?.message || 'Failed to delete the request.'
        });
      }
    });
  }
}

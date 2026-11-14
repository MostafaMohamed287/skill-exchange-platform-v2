import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Skill } from '../../services/skill';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-skills',
  imports: [FormsModule, RouterLink],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills implements OnInit {

  private skillService = inject(Skill);
  auth = inject(Auth);

  skills = signal<any[]>([]);
  errorMessage = signal('');

  totalSkills = computed(() => this.skills().length);
  programmingCount = computed(() => this.skills().filter(s => s.category === 'Programming').length);
  intermediateCount = computed(() => this.skills().filter(s => s.level === 'Intermediate').length);
  advancedCount = computed(() => this.skills().filter(s => s.level === 'Advanced').length);

  title = '';
  description = '';
  category = '';
  level = '';

  editingSkillId: string | null = null;

  ngOnInit() {
    this.getSkills();
  }

  getSkills() {
    this.skillService.getSkills().subscribe({
      next: (response) => this.skills.set(response),
      error: () => this.errorMessage.set('Failed to load skills.')
    });
  }

  // المستخدم يقدر يعدّل/يمسح السكيلز بتاعته بس (الأدمن يقدر على الكل)
  canManage(skill: any): boolean {
    const user = this.auth.user();
    if (!user) return false;

    const ownerId = skill.owner?._id ?? skill.owner;
    return user.role === 'Admin' || ownerId === user._id;
  }

  private formIsValid(): boolean {
    if (!this.title.trim() || !this.category.trim() || !this.description.trim() || !this.level) {
      this.errorMessage.set('Please fill in all fields.');
      return false;
    }
    this.errorMessage.set('');
    return true;
  }

  addSkill() {
    if (!this.formIsValid()) return;

    const data = {
      title: this.title,
      description: this.description,
      category: this.category,
      level: this.level,
      owner: this.auth.user()?._id   // بياخد الـ id بتاع المستخدم المسجل تلقائي
    };

    this.skillService.createSkill(data).subscribe({
      next: () => {
        this.clearForm();
        this.getSkills();
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to create skill.');
      }
    });
  }

  editSkill(skill: any) {
    this.editingSkillId = skill._id;

    this.title = skill.title;
    this.description = skill.description;
    this.category = skill.category;
    this.level = skill.level;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateSkill() {
    if (!this.editingSkillId || !this.formIsValid()) return;

    const data = {
      title: this.title,
      description: this.description,
      category: this.category,
      level: this.level
    };

    this.skillService.updateSkill(this.editingSkillId, data).subscribe({
      next: () => {
        this.clearForm();
        this.getSkills();
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to update skill.');
      }
    });
  }

  deleteSkill(id: string) {
    if (!confirm('Delete this skill?')) return;

    this.skillService.deleteSkill(id).subscribe({
      next: () => this.getSkills(),
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to delete skill.');
      }
    });
  }

  clearForm() {
    this.title = '';
    this.description = '';
    this.category = '';
    this.level = '';
    this.editingSkillId = null;
    this.errorMessage.set('');
  }
}

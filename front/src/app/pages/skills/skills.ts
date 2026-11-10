import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Skill } from '../../services/skill';

@Component({
  selector: 'app-skills',
  imports: [FormsModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {

  private skillService = inject(Skill);

  skills: any[] = [];

  title = '';
  description = '';
  category = '';
  level = '';
  owner = '';

  editingSkillId: string | null = null;

  ngOnInit() {
    console.log('Skills component loaded');

    this.getSkills();
  }

  getSkills() {
    console.log('getSkills() called');

    this.skillService.getSkills().subscribe({
      next: (response) => {
  console.log('Skills response:', response);
  console.log('Number of skills:', response.length);

  this.skills = response;

  console.log('Skills variable:', this.skills);
},
      error: (error) => {
        console.log('Failed to get skills:', error);
      }
    });
  }

  addSkill() {
    const data = {
      title: this.title,
      description: this.description,
      category: this.category,
      level: this.level,
      owner: this.owner
    };

    this.skillService.createSkill(data).subscribe({
      next: (response) => {
        console.log('Skill created:', response);

        this.clearForm();
        this.getSkills();
      },

      error: (error) => {
        console.log('Failed to create skill:', error);
      }
    });
  }

  editSkill(skill: any) {
    this.editingSkillId = skill._id;

    this.title = skill.title;
    this.description = skill.description;
    this.category = skill.category;
    this.level = skill.level;
    this.owner = skill.owner?._id || skill.owner;
  }

  updateSkill() {
    if (!this.editingSkillId) {
      return;
    }

    const data = {
      title: this.title,
      description: this.description,
      category: this.category,
      level: this.level,
      owner: this.owner
    };

    this.skillService.updateSkill(this.editingSkillId, data).subscribe({
      next: () => {
        this.clearForm();
        this.getSkills();
      },

      error: (error) => {
        console.log('Failed to update skill:', error);
      }
    });
  }

  deleteSkill(id: string) {
    this.skillService.deleteSkill(id).subscribe({
      next: () => {
        this.getSkills();
      },

      error: (error) => {
        console.log('Failed to delete skill:', error);
      }
    });
  }

  clearForm() {
    this.title = '';
    this.description = '';
    this.category = '';
    this.level = '';
    this.owner = '';
    this.editingSkillId = null;
  }
}
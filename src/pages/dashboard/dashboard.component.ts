import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../api/dashboard.service';
import { DashboardResponse } from '../../models/dashboardResponse';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardResponse | null = null;
  isLoading = true;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}

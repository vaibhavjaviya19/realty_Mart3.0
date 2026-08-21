import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thank-you-register',
  templateUrl: './thank-you-register.component.html',
  styleUrls: ['./thank-you-register.component.css']
})
export class ThankYouRegisterComponent implements OnInit, OnDestroy {
  countdown = 15;
  progress = 0;
  intervalId: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown(): void {
    const totalSeconds = 15;
    this.intervalId = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
        this.progress = ((totalSeconds - this.countdown) / totalSeconds) * 100;
      } else {
        this.goHome();
      }
    }, 1000);
  }

  goHome(): void {
    clearInterval(this.intervalId);
    const redirectUrl = localStorage.getItem('redirectAfterAuth');
    if (redirectUrl) {
      localStorage.removeItem('redirectAfterAuth');
      this.router.navigate([redirectUrl]);
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

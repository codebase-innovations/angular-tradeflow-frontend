import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginObj: Login;
  hide = true;

  constructor(
    public themeService: CustomizerSettingsService,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginObj = new Login();
  }

  OnLogin() {
    // JSON payload matching Swagger's request
    const body = {
      username: this.loginObj.UserName,
      password: this.loginObj.Password,
    };

    // Headers matching Swagger
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': '*/*',
    });

    this.http
      .post<any>('http://desktop-ogvciv0:61182/auth-server/oauth/token', body, { headers })
      .subscribe({
        next: (res) => {
          // Save token in localStorage
          localStorage.setItem('access_token', res.access_token);

          // Success message and redirect
          alert('Login successful!');
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          console.error('Login failed:', JSON.stringify(err, null, 2));
          alert('Login failed: ' + (err.error?.error_description || 'Invalid credentials'));
        },
      });
  }

  // Theme toggles
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleCardBorderTheme() {
    this.themeService.toggleCardBorderTheme();
  }

  toggleCardBorderRadiusTheme() {
    this.themeService.toggleCardBorderRadiusTheme();
  }

  toggleRTLEnabledTheme() {
    this.themeService.toggleRTLEnabledTheme();
  }
}

// Model Class
export class Login {
  UserName: string;
  Password: string;

  constructor() {
    this.UserName = '';
    this.Password = '';
  }
}
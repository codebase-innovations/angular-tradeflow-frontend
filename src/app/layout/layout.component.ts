import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomizerSettingsService } from '../components/customizer-settings/customizer-settings.service'; 
import { ToggleService } from '../components/common/header/toggle.service'; 

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
   isToggled = false;
  
      constructor(
          public router: Router,
          private toggleService: ToggleService,
          public themeService: CustomizerSettingsService
      ) {
          this.toggleService.isToggled$.subscribe(isToggled => {
              this.isToggled = isToggled;
          });
      }
  
      toggleRightSidebarTheme() {
          this.themeService.toggleRightSidebarTheme();
      }
  
      toggleHideSidebarTheme() {
          this.themeService.toggleHideSidebarTheme();
      }
  
      toggleCardBorderTheme() {
          this.themeService.toggleCardBorderTheme();
      }
  
      toggleTheme() {
          this.themeService.toggleTheme();
      }
  
      toggleCardBorderRadiusTheme() {
          this.themeService.toggleCardBorderRadiusTheme();
      }
  
      toggleRTLEnabledTheme() {
          this.themeService.toggleRTLEnabledTheme();
      }
  
}

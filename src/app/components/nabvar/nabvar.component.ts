import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nabvar',
  templateUrl: './nabvar.component.html',
  styleUrls: ['./nabvar.component.scss'],
})
export class NabvarComponent implements OnInit {

  cambioLocal: any;

  // currentRoute: string;

  constructor(private route: ActivatedRoute, private router: Router) {
  //   let local: string = this.route.snapshot.paramMap.get('local') || ''
  //   this.currentRoute = "";
  //   this.router.events.subscribe((event: Event) => {
  //     if (event instanceof NavigationStart) {
  //         // Show loading indicator
  //         console.log('Route change detected');
  //         this.cambioLocal = local
  //     }
  
  //     if (event instanceof NavigationEnd) {
  //         // Hide loading indicator
  //         this.currentRoute = event.url;          
  //           console.log(event);
  //           this.cambioLocal = local
  //     }
  
  //     if (event instanceof NavigationError) {
  //         // Hide loading indicator
  
  //         // Present error to user
  //         console.log(event.error);
  //     }
  // });
  }

  ngOnInit(): void {
    let local: string = this.route.snapshot.paramMap.get('local') || ''
    if (local == 'tate') {
      this.cambioLocal = 'tate'
    } else if (local == 'kilroy') {
      this.cambioLocal = 'kilroy'
    } else if (local == 'kilroykids') {
      this.cambioLocal = 'kilroykids'
    } else if (local == 'tateexpress') {
      this.cambioLocal = 'tateexpress'
    } else if (local == 'kitexpress') {
      this.cambioLocal = 'kitexpress'
    } else {
      this.router.navigate(["home/tate"])
      this.cambioLocal = 'tate'
    }
    console.log(this.cambioLocal)
  }

  cambioTate(){
  this.cambioLocal = 'tate'    
  }
  cambioExpress(){
    this.cambioLocal = 'tateexpress'
  }
  cambioKilroy(){
    this.cambioLocal = 'kilroy'
  }
  cambioKit(){
    this.cambioLocal = 'kitexpress'
  }
  cambioKids(){
    this.cambioLocal = 'kilroykids'
  }
}

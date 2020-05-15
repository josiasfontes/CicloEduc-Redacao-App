import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
    {
        // path: '', redirectTo: 'login', pathMatch: 'full'
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    { 
        path: 'perfil', 
        loadChildren: './perfil/perfil.module#PerfilModule'
    },
    { 
        path: 'login', 
        loadChildren: './login/login.module#LoginPageModule'
    },
    {
        path: 'start', 
        loadChildren: './tabs/tabs.module#TabsPageModule'
    }
    
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

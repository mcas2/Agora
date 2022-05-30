import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";

import { MainComponent } from './main/main.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

const panelRoutes: Routes = [
	{
		path: 'panel',
		component: MainComponent,
		children: [
			{path: '', component: ListComponent},
			{path: 'list', component: ListComponent},
			{path: 'create', component: AddComponent},
			{path: 'edit/:id', component: EditComponent},
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(panelRoutes)
	],
	exports: [
		RouterModule
	]
})

export class PanelRoutingModule {}
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { PanelRoutingModule } from "./panel-routing";

import { MainComponent } from './main/main.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

@NgModule({
	declarations: [
		MainComponent,
		ListComponent,
		AddComponent,
		EditComponent
	],
	imports: [
		CommonModule, 
		FormsModule,
		HttpClientModule,
		PanelRoutingModule
	], 
	exports: [
		MainComponent,
		ListComponent,
		AddComponent,
		EditComponent
	],
	providers: [

	]
})

export class PanelModule {}
import {Component, Input} from '@angular/core';
import {ArtworkCardComponent} from './artwork-card/artwork-card.component';
import {NoArtworksComponent} from './no-artworks/no-artworks.component';
import {Artwork} from '../../../../models/artwork.model';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-artworks',
  imports: [
    ArtworkCardComponent,
    NoArtworksComponent,
    NgForOf
  ],
  templateUrl: './artworks.component.html',
  styleUrl: './artworks.component.css'
})

export class ArtworksComponent {
  @Input() artworks: Artwork[] = [];

  ngOnInit(){

  }
}

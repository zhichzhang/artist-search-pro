import { Component } from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {ArtistInfoComponent} from './artist-info/artist-info.component';
import {ArtworksComponent} from './artworks/artworks.component';
import {CardSelectionService} from '../../../core/services/card-selection/card-selection.service';
import {ArtistDetailsService} from '../../../core/services/artist-details/artist-details.service';
import {ArtistInfo} from '../../../models/artist-info.model';
import {Artwork} from '../../../models/artwork.model';
import {NoArtworksComponent} from './artworks/no-artworks/no-artworks.component';

@Component({
  selector: 'app-artist-details',
  imports: [
    NgClass,
    ArtistInfoComponent,
    NgIf,
    ArtworksComponent,
    NoArtworksComponent
  ],
  templateUrl: './artist-details.component.html',
  styleUrl: './artist-details.component.css'
})
export class ArtistDetailsComponent {
  currentSection: string = 'artistInfo';
  isLoading: boolean = false;
  isCardSelected = false;
  noArtworks: boolean = false;
  artistInfo: ArtistInfo = new ArtistInfo();
  artworks: Artwork[] = [];

  constructor(private cardSelectionService: CardSelectionService, private artistDetailsService: ArtistDetailsService) {}

  ngOnInit() {
    this.cardSelectionService.isCardSelected$.subscribe(isCardSelected => this.isCardSelected = isCardSelected);
    this.artistDetailsService.artistInfo$.subscribe(artistInfo => this.artistInfo = artistInfo);
    this.artistDetailsService.artworks$.subscribe(artworks => this.artworks = artworks);
    this.artistDetailsService.isLoading$.subscribe(isLoading => this.isLoading = isLoading)
    // this.noArtworks = this.artworks.length === 0;
  }

  onClick(section: string){
    if (section === 'artistInfo'){

    }else{

    }
    this.currentSection = section;
  }

  fetchArtistInfo(){

  }

  fetchArtworks(){

  }
}

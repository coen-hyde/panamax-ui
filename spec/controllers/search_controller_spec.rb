require 'spec_helper'

describe SearchController do
  let(:fake_result_set) do
    double(:fake_result_set)
  end

  describe 'GET #new' do
    it 'creates and assigns a search result set object' do
      expect(SearchResultSet).to receive(:new).and_return(fake_result_set)

      get :new

      expect(assigns(:search_result_set)).to eq fake_result_set
    end
  end

  describe 'GET #show' do
    before do
      SearchResultSet.stub(:new).and_return(fake_result_set)
    end

    it 'searches for the supplied query' do
      expect(SearchResultSet).to receive(:find).with(params: { 'q' => 'apache' }).and_return(fake_result_set)

      get :show, search_result_set: { q: 'apache' }
    end

    context 'when successful' do
      before do
        SearchResultSet.stub(:find).and_return(fake_result_set)
      end

      context 'when an html request' do
        it 'assigns the results' do
          get :show, search_result_set: { q: 'apache' }

          expect(assigns(:search_result_set)).to eql fake_result_set
        end
      end

      context 'when a json request' do
        it 'returns the json representation of the results' do
          get :show, search_result_set: { q: 'apache' }, format: :json

          expect(response.body).to eql fake_result_set.to_json
        end
      end
    end
  end

  describe 'GET #load_tags' do

    let(:repo) { Repository.new(id: 'foo/bar', tags: ['latest']) }

    before do
      Repository.stub(:find).and_return(repo)
    end

    it 'returns a list of tags' do
      get :load_tags, repo: repo, format: :json
      expect(response.body).to eql repo.tags.to_json
    end

    context 'when the local_image parameter is set to true' do

      it 'passes local=true flag to the API call' do
        expect(Repository).to receive(:find)
          .with(repo.id, params: { local: true })

        get :load_tags, repo: repo.id, local_image: true, format: :json
      end
    end

    context 'when the local_image parameter is set to false' do

      it 'passes local=false flag to the API call' do
        expect(Repository).to receive(:find)
          .with(repo.id, params: { local: false })

        get :load_tags, repo: repo.id, local_image: false, format: :json
      end
    end
  end
end
